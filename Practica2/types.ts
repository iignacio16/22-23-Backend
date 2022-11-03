export type User = {
    DNI: string,
    nombre: string,
    apellido: string,
    Telefono:string,
    email: string,
    IBAN: string,
    ID: string,
}

export type transaction = {
    ID_sender:string,
    ID_reciber:string,
    amount:string
}