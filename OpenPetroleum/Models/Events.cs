namespace OpenPetroleum.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Events : DbContext
    {
        public Events()
            : base("name=EventsContext")
        {
        }

        public virtual DbSet<OPs_Events> OPs_Events { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
