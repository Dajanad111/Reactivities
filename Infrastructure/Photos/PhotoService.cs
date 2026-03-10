using System;
using Application.Interfaces;
using Application.Profiles.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(IOptions<CloudinarySettings> config) // Konstruktor klase – prihvata konfiguraciju putem dependency injection-a
    { 
        var account = new Account(  // Kreiranje Cloudinary Account objekta koristeći podatke iz konfiguracije
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account); // Inicijalizacija Cloudinary klijenta sa kreiranim nalogom
    }

    public async Task<PhotoUploadResult?> UploadPhoto(IFormFile file) // <param name="file">IFormFile objekat koji predstavlja uploadovanu sliku</param>
    {// <returns>PhotoUploadResult? objekat sa PublicId i Url-om, ili null ako failuje</returns>
        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream(); // Kreiranje asinhronog stream-a za čitanje sadržaja fajla
            var uploadParams = new ImageUploadParams    // Konfiguracija parametara za upload slike //ImageUploadParams dolaze sa cloudinary
            {
                File = new FileDescription(file.FileName, stream),  // FileDescription povezuje ime fajla sa stream-om podataka
                // Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
                Folder = "Reactivities2026"  // Folder u Cloudinary-u gde će slika biti sačuvana
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);    // Asinhrono slanje zahteva za upload na Cloudinary

            if (uploadResult.Error != null) // Provera da li je došlo do greške prilikom upload-a
            {
                throw new Exception(uploadResult.Error.Message);// Bacanje exception-a sa porukom o grešci ako upload nije uspeo
            }

            return new PhotoUploadResult // Kreiranje i vraćanje PhotoUploadResult objekta sa uspešnim podacima
            {
                    PublicId = uploadResult.PublicId,       // Jedinstveni ID slike u Cloudinary-u (koristi se za delete/update)
                Url = uploadResult.SecureUrl.AbsoluteUri,      // HTTPS URL za pristup uploadovanoj slici
            };
        }

        return null;    // Vraća null ako fajl nema sadržaj (prazan ili nevalidan)
    }

    public async Task<string> DeletePhoto(string publicId) // <param name="publicId">Jedinstveni identifikator slike u Cloudinary-u</param>
    {
        var deletionParams = new DeletionParams(publicId);   // Kreiranje parametara za brisanje sa prosleđenim publicId-jem

        var result = await _cloudinary.DestroyAsync(deletionParams);  // Asinhrono slanje zahteva za brisanje slike sa Cloudinary-a

        if (result.Error != null)   // Provera da li je došlo do greške prilikom brisanja
        {
            throw new Exception(result.Error.Message); // Bacanje exception-a sa porukom o grešci ako brisanje nije uspelo
        }

        return result.Result;
        // Vraća string rezultat operacije brisanja (npr. "ok" = uspešno, "not found" = slika ne postoji)
    }
}