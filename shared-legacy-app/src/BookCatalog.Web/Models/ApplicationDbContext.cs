using System;
using System.Collections.Generic;
using System.Data.Entity;

namespace BookCatalog.Web.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base("BookCatalogContext")
        {
        }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }

    public class BookCatalogInitializer : DropCreateDatabaseIfModelChanges<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            SeedBooks(context);
        }

        public static void SeedBooks(ApplicationDbContext context)
        {
            var books = new List<Book>
            {
                new Book { Title = "The Hitchhiker's Guide to the Galaxy", Author = "Douglas Adams", ISBN = "9780345391803", PublishedYear = 1979, IsActive = true, CreatedDate = new DateTime(2001, 3, 15) },
                new Book { Title = "Design Patterns: Elements of Reusable OO Software", Author = "Gamma, Helm, Johnson, Vlissides", ISBN = "9780201633610", PublishedYear = 1994, IsActive = true, CreatedDate = new DateTime(2000, 6, 1) },
                new Book { Title = "The Pragmatic Programmer", Author = "David Thomas, Andrew Hunt", ISBN = "9780135957059", PublishedYear = 1999, IsActive = true, CreatedDate = new DateTime(2001, 1, 10) },
                new Book { Title = "Clean Code", Author = "Robert C. Martin", ISBN = "9780132350884", PublishedYear = 2008, IsActive = true, CreatedDate = new DateTime(2008, 8, 11) },
                new Book { Title = "The Lord of the Rings", Author = "J.R.R. Tolkien", ISBN = "9780618640157", PublishedYear = 1954, IsActive = true, CreatedDate = new DateTime(1999, 12, 1) },
                new Book { Title = "Jurassic Park", Author = "Michael Crichton", ISBN = "9780345370778", PublishedYear = 1990, IsActive = true, CreatedDate = new DateTime(2001, 7, 22) },
                new Book { Title = "The Matrix: The Shooting Script", Author = "Andy & Larry Wachowski", ISBN = "9781557044488", PublishedYear = 2001, IsActive = false, CreatedDate = new DateTime(2001, 11, 6) },
            };
            books.ForEach(b => context.Books.Add(b));
            context.SaveChanges();
        }
    }
}
