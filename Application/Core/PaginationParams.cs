using System;

namespace Application.Core;

public class PaginationParams<Tcursor>
{
    private const int MaxPageSize = 50;
    public Tcursor? Cursor { get; set; }
    private int _pageSize = 3; //ne može pristupiti ovoj varijabli izvan ove klase.
    public int PageSize //sluzi da vanjski kod komunicira s privatnim poljem _pageSize.
    {
        get => _pageSize; //vraca trenutnu vrijednost pagesize
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; //value: Predstavlja vrijednost koju korisnik pokušava postaviti.
    } //Provjerava je li ta vrijednost veća od maksimalno dozvoljene, ako jeste ogranicava tu vrijednost na maksimum 

}
