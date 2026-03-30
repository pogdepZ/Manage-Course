import { http } from './http';

export async function getPermissions() {
    const response = await http.get('/permissions');
    return response.data;
}

export async function updatePermissions(config) {
    const response = await http.put('/permissions', { config });
    return response.data;
}
