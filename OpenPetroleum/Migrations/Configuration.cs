namespace OpenPetroleum.Migrations
{
    using System;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using OpenPetroleum.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<OpenPetroleum.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(OpenPetroleum.Models.ApplicationDbContext context)
        {
            var passwordHash = new PasswordHasher();
            string password = passwordHash.HashPassword("CDLE0ps!");
            context.Users.AddOrUpdate(u => u.UserName,
                new ApplicationUser
                {
                    UserName = "Amy.Miller@state.co.us",
                    PasswordHash = password,
                    PhoneNumber = "3033188530",
                    Email = "Amy.Miller@state.co.us",
                    SecurityStamp = Guid.NewGuid().ToString()
                });
            var passwordHashOIT = new PasswordHasher();
            string passwordOIT = passwordHashOIT.HashPassword("CDLE0ps!");
            context.Users.AddOrUpdate(u => u.UserName,
                new ApplicationUser
                {
                    UserName = "kassrah.rezagholi@state.co.us",
                    PasswordHash = passwordOIT,
                    PhoneNumber = "3037646871",
                    Email = "kassrah.rezagholi@state.co.us",
                    SecurityStamp = Guid.NewGuid().ToString()
                });
        }
    }
}
