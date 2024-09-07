import { Container, Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useState, ChangeEvent } from "react";
import ButtonTS from "../components/atoms/ButtonTS";
import InputFieldTS from "../components/atoms/InputFieldTS";
import { useCreateBook } from "../hooks/bookHooks";
import { BookRequest } from "../model/book";
import "../css/CreateBook.css"
import { CategoryResponse } from "../model/category";
import { useGetAllCategories } from "../hooks/categoryHooks";

const CreateBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<CategoryResponse[]>([]);

    const [isbnError, setIsbnError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [authorError, setAuthorError] = useState('');
    const [emptyError, setEmptyError] = useState('');

    const { createBookHandler, errorMessage, loading } = useCreateBook();
    const { categories, loading: categoryLoading, error: categoryError } = useGetAllCategories();

    const onChangeIsbn = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsbn(value);
        if (value.length !== 11) {
            setIsbnError('ISBN must be 11 characters long');
        } else {
            setIsbnError('');
        }
    };

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (value.trim() === '') {
            setTitleError('Title cannot be empty');
        } else {
            setTitleError('');
        }
    };

    const onChangeAuthor = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuthor(value);
        if (value.trim() === '') {
            setAuthorError('Author cannot be empty');
        } else {
            setAuthorError('');
        }
    };

    const handleCategoryChange = (event: any) => {
        const { value } = event.target;
        setSelectedCategories(
            typeof value === 'string'
                ? categories.filter((category: any) => category.name === value)
                : value
        );
    };

    const handleCreateBookClick = () => {
        if (!isbn || !title || !author) {
            setEmptyError('All fields are required');
            return;
        } else {
            setEmptyError('');
        }

        if (!isbnError && !titleError && !authorError) {
            const bookData: BookRequest = {
                isbn,
                title,
                description,
                image_url: imageUrl,
                author,
                release_date: new Date(releaseDate),
                categories: selectedCategories,
            };
            createBookHandler(bookData);
        }
    };

    return (
        <Container className="create-book-container" maxWidth="xs">
            <Box>
                <Paper className="create-book-paper">
                    <Typography className="create-book-title" variant="h4" align="center" gutterBottom>
                        Create Book
                    </Typography>
                    <InputFieldTS
                        label="ISBN"
                        name="isbn"
                        value={isbn}
                        error={isbnError}
                        onChange={onChangeIsbn}
                    />
                    <InputFieldTS
                        label="Title"
                        name="title"
                        value={title}
                        error={titleError}
                        onChange={onChangeTitle}
                    />
                    <InputFieldTS
                        label="Description"
                        name="description"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    />
                    <InputFieldTS
                        label="Image URL"
                        name="image_url"
                        value={imageUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                    />
                    <InputFieldTS
                        label="Author"
                        name="author"
                        value={author}
                        error={authorError}
                        onChange={onChangeAuthor}
                    />
                    <InputFieldTS
                        label="Release Date"
                        name="release_date"
                        value={releaseDate}
                        type="date"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseDate(e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Categories</InputLabel>
                        <Select
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => selected.map((category: CategoryResponse) => category.name).join(', ')}
                        >
                            {categories.map((category: any) => (
                                <MenuItem key={category.id} value={category}>
                                    <Checkbox checked={selectedCategories.some(c => c.id === category.id)} />
                                    <ListItemText primary={category.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {emptyError && (
                        <Typography align='center' color="error" sx={{ mt: 2 }}>
                            {emptyError}
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography align='center' color="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <ButtonTS
                        type="button"
                        variant="contained"
                        onClick={handleCreateBookClick}
                        fullWidth
                        label={loading ? 'Creating...' : 'Create Book'}
                        disabled={loading || categoryLoading}
                    >
                        Create Book
                    </ButtonTS>
                </Paper>
            </Box>
        </Container>
    );
};

export default CreateBookPage;