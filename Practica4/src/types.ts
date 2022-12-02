export type Vendedor = {
    id:string;
    name:string;
    email:string;
    phone:string;
    cars: string[];
}

export type Coche = {
    id:string,
    brand:string,
    model:string,
    plate:string,
    price:number,
    fabricationDate: string
}

export type Concesionario = {
    id:string,
    nombre: string,
    email: string,
    telefono: string,
    localizacion:string,
    vendedores: string[]
}