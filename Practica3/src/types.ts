export type user =  {
    name: string,
    password: string, //cifrada
    email: string,
    createdAt: string,
    Cart? : string[]
}

export type books = {
    title: string,
    author: string,
    pages: number,
    ISBN : string
}

export type author = {
    name : string,
    idBooks? : string[]
}