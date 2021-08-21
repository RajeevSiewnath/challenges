import axios from "axios";
import {Consent} from "./types";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
});

export async function getConsents(): Promise<Array<Consent>> {
    return (await api.get<Array<Consent>>('/consents')).data;
}

export async function postConsents(consent: Consent): Promise<Array<Consent>> {
    return (await api.post<Array<Consent>>('/consents', consent)).data;
}

export default api;