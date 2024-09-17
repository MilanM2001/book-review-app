export type ReviewRequest = {
    title: string
    text: string
    rating: number
    book_isbn: string
    username: string
};

export type ReviewResponse = {
    title: string
    text: string
    rating: number
    username: string
    created_at: Date
}