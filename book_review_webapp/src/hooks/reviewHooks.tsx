import { useState, useEffect } from "react";
import { ReviewRequest, ReviewResponse } from "../model/review";
import { createReview, getReviewsByBookIsbn, getReviewsByUsername } from "../services/reviewService";

export const useCreateReview = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReviewHandler = async (review: ReviewRequest) => {
        try {
            setIsLoading(true);
            await createReview(review);
        } catch (err) {
            setError("Failed to create review");
        } finally {
            setIsLoading(false);
        }
    };

    return { createReviewHandler, loading, error };
};

export const useGetReviewsByUsername = (username: string) => {
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const reviewsData = await getReviewsByUsername(username);
                setReviews(reviewsData);
            } catch (err) {
                setError("Failed to fetch reviews");
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchReviews();
        }
    }, [username]);

    return { reviews, loading, error };
};

export const useGetReviewsByBookIsbn = (book_isbn: string) => {
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const reviewsData = await getReviewsByBookIsbn(book_isbn);
                setReviews(reviewsData);
            } catch (err) {
                setError("Failed to fetch reviews");
            } finally {
                setIsLoading(false);
            }
        };

        if (book_isbn) {
            fetchReviews();
        }
    }, [book_isbn]);

    return { reviews, loading, error };
};