import { useQuery } from "@tanstack/react-query";

const API_LINK = 'http://localhost:8080/tenants'; // could change

/* const getTenants = () => { no use right now
const { data: users = [], } = useQuery({
        queryKey:['users'],
        queryFn: async () =>{
        const res = await fetch(`${API_LINK}/getAll`);
        if (!res.ok) throw new Error('Failed to fetch tenants');
        return res.json();
    }})
} */

type Role = 'TENANT' | 'MANAGER' | 'TECHNICIAN'

export interface tenantProp {
    name: string,
    email: string,
    password: string,
    role: Role,
    createdAt: Date
}

export const insertCall = async (tenant: tenantProp) => {
    const res = await fetch(`${API_LINK}/insert`, 
            {method:'POST',body:JSON.stringify({tenant})}
        );
        if (!res.ok) throw new Error('Failed to insert tenant');
        return res.json();
}

/* const insertTenant = (tenant:tenantProp) => { put this in the component?
const { data , } = useQuery({
        queryKey:['insertUser',tenant],
        queryFn: async () =>{
            insertCall(tenant);
        }})
} */