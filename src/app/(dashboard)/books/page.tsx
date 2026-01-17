import { BookList, getBooks } from "@/features/books";

export default async function BooksPage() {
  const books = await getBooks();

  return <BookList books={books} />;
}
