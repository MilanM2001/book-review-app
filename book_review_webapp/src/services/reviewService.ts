import { ReviewRequest } from "../model/review";
import api from "./api";

const createReview = async (review: ReviewRequest) => {
    try {
        await api.post("/reviews/create", review);
    } catch (error) {
        console.error("Create Review error:", error);
        throw error;
    }
};

const getReviewsByUsername = async (username: string) => {
    try {
        const response = await api.get(`/reviews/allByUsername/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

const getReviewsByBookIsbn = async (bookIsbn: string) => {
    try {
        const response = await api.get(`/reviews/allByBookIsbn/${bookIsbn}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export { createReview, getReviewsByUsername, getReviewsByBookIsbn }