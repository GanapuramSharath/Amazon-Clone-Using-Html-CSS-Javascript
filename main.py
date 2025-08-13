from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load product data (you should replace this with your actual product database)
with open('updated_products.json') as f:
    products = json.load(f)

# Load pre-trained sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Precompute embeddings for all products
product_embeddings = {}
for category, items in products.items():
    product_embeddings[category] = {
        'products': items,
        'embeddings': model.encode([item['description'] for item in items])
    }

class SearchQuery(BaseModel):
    query: str
    category: str = None
    limit: int = 10

@app.post("/search")
async def search_products(search_query: SearchQuery):
    try:
        # Encode the search query
        query_embedding = model.encode(search_query.query)
        
        results = []
        
        if search_query.category:
            # Search within specific category
            if search_query.category not in product_embeddings:
                raise HTTPException(status_code=404, detail="Category not found")
                
            embeddings = product_embeddings[search_query.category]['embeddings']
            products = product_embeddings[search_query.category]['products']
            
            # Calculate similarity scores
            similarities = cosine_similarity(
                [query_embedding],
                embeddings
            )[0]
            
            # Get top results
            top_indices = np.argsort(similarities)[-search_query.limit:][::-1]
            results = [products[i] for i in top_indices]
        else:
            # Search across all categories
            all_results = []
            for category, data in product_embeddings.items():
                embeddings = data['embeddings']
                products = data['products']
                
                similarities = cosine_similarity(
                    [query_embedding],
                    embeddings
                )[0]
                
                top_indices = np.argsort(similarities)[-search_query.limit:][::-1]
                category_results = [{
                    **products[i],
                    'category': category,
                    'score': float(similarities[i])
                } for i in top_indices]
                
                all_results.extend(category_results)
            
            # Sort all results by score and limit
            all_results.sort(key=lambda x: x['score'], reverse=True)
            results = all_results[:search_query.limit]
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add endpoint to get product categories
@app.get("/categories")
async def get_categories():
    return {"categories": list(products.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
