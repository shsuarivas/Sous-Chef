const BASE = 'http://sous-chef-backend-1:8080/api'; // Node Testing
//const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'; // Vite Testing

export async function getRecipeById(id) {
    const res = await fetch(`${BASE}/recipe/${id}`);
    return res.json();
}

export async function getRecipeByName(name) {
    const res = await fetch(`${BASE}/recipe/${name}`);
    return res.json();
}