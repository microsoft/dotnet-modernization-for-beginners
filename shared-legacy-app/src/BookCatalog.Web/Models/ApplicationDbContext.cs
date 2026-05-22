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
}
