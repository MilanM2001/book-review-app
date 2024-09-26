import { CategoryResponse } from "./category"

export type BookResponse = {
    isbn: string
    title: string
    description: string
    image_url: string
    author: string
    release_date: Date
    categories: CategoryResponse[]
}

export type BookRequest = {
    isbn: string
    title: string
    description: string
    image: File | null
    author: string
    release_date: string
    categories: CategoryResponse[]
}

export type BookUpdate = {
    title: string
    description: string
    categories: CategoryResponse[]
}