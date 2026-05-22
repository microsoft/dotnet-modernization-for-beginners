using System;
using System.ComponentModel.DataAnnotations;

namespace BookCatalog.Web.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(100)]
        public string Author { get; set; }

        [StringLength(13)]
        public string ISBN { get; set; }

        [Display(Name = "Published Year")]
        [Range(1800, 2100)]
        public int? PublishedYear { get; set; }

        [Display(Name = "Active")]
        public bool IsActive { get; set; }

        public DateTime CreatedDate { get; set; }

        public Book()
        {
            CreatedDate = DateTime.Now;
            IsActive = true;
        }
    }
}
