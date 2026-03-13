using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Activity> Activities { get; set; } //pravi tabelu activities koja ima puno activity
    public required DbSet<ActivityAttendee> ActivityAttendees { get; set; } //pravi tabelu activityattendees koja sadrzi ActivityAttendee

    public required DbSet<Photo> Photos { get; set; }
    public required DbSet<Comment> Comments { get; set; }
    public required DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) //govori Entity Framework Core-u kako da kreira i poveže tabele u bazi.
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>
        (x => x.HasKey(a => new { a.ActivityId, a.UserId })); //Tabela ActivityAttendees neće imati jedan običan ID (kao npr. Id int).
                                                              //  Umesto toga, kombinacija ActivityId + UserId mora biti jedinstvena.

        //User (1) ────────< (M) ActivityAttendee
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.User)           // svaki zapis u tabeli ActivityAttendees pokazuje na tačno jednog korisnika (HasOne
            .WithMany(x => x.Activities)   // User može imati MNOGO Activity zapisa
            .HasForeignKey(x => x.UserId); //  "strani ključ" je  UserId!

        //Activity (1) ────────< (M) ActivityAttendee
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.Activity) //Svaki zapis u ActivityAttendees pripada tačno jednoj aktivnosti.
            .WithMany(x => x.Attendees) // ta aktivnost može imati mnogo učesnika (zapravo, mnogo zapisa u ovoj tabeli).
            .HasForeignKey(x => x.ActivityId); //Povezujemo ih preko kolone ActivityId 

        builder.Entity<UserFollowing>(b =>
    {
        b.HasKey(k => new { k.ObserverId, k.TargetId }); // Kompozitni primarni ključ

        b.HasOne(o => o.Observer) // Veza: Observer (ko prati)
            .WithMany(f => f.Followings)      // User prati MNOGO drugih
            .HasForeignKey(o => o.ObserverId) // Strani ključ je ObserverId
            .OnDelete(DeleteBehavior.Cascade); // Ako se obrise user, obrisi i praćenja
        b.HasOne(t => t.Target)   // Target (koga prate)
            .WithMany(f => f.Followers)       // User ima MNOGO pratilaca
            .HasForeignKey(t => t.TargetId)   // Strani ključ je TargetId
            .OnDelete(DeleteBehavior.Cascade);
    });



        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(  //podesavamo da se vrijeme ucitavanja koemntara poklapa
           v => v.ToUniversalTime(), // Convert to UTC before saving
           v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Read as UTC
       );

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }

    }
}