import axios from 'axios';
import { Produto } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND || 'http://localhost:3333/api';

export async function getProdutos(): Promise<Produto[]> {
    const { data } = await axios.get(`${API_URL}/produtos`);
    return data;
}

export async function getProduto(id: string): Promise<Produto> {
    const { data } = await axios.get(`${API_URL}/produtos/${id}`);
    return data;
}

export async function getCategorias(): Promise<any[]> {
    const { data } = await axios.get(`${API_URL}/categorias`);
    return data;
}