import { useQuery } from "@tanstack/react-query";

const API_LINK = 'http://localhost:8080/tenants';

const getTenants = () => {
const { data: users = [], } = useQuery({
        queryKey:['users'],
        queryFn: async () =>{
        const res = await fetch('http://localhost:8080/tenants/getAll');
        if (!res.ok) throw new Error('Failed to fetch tenants');
        return res.json();
    }})
}

interface tenantProp {
    name: string,
    email: string,
    password: string,
    role: string,
    createdAt: Date
}

export const insertCall = async (tenant: tenantProp) => {
    const res = await fetch('http://localhost:8080/tenants/insert', 
            {method:'POST',body:JSON.stringify({tenant})}
        );
        if (!res.ok) throw new Error('Failed to insert tenant');
        return res.json();
}

/* const insertTenant = (tenant:tenantProp) => {
const { data , } = useQuery({
        queryKey:['insertUser',tenant],
        queryFn: async () =>{
            insertCall(tenant);
        }})
} */

export { getTenants,  }