import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationTasksProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function PaginationTasks({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationTasksProps) {
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
            className="cursor-pointer"
          >
            Précédent
          </PaginationPrevious>
        </PaginationItem>

        {pagesArray.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={page === currentPage}
              className="cursor-pointer"
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages - 1))
            }
            className="cursor-pointer"
          >
            Suivant
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
