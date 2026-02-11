using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext : DbContext //Kreira klasu koja nasleđuje DbContext i omogućava rad sa bazom podataka.
{
    public AppDbContext(DbContextOptions<AppDbContext> options) //Konstruktor koji prima konfiguraciju baze (kao što je connection string).
        : base(options) //Prosleđuje tu konfiguraciju roditeljskoj DbContext klasi.
    {
    }

    public required DbSet<Activity> Activities { get; set; } //Definiše kolekciju "Activities" koja predstavlja tabelu u bazi sa Activity entitetima.
}