using System;

namespace Application.Core;


public class PagedList<T, TCursor>
{
    public List<T> Items { get; set; } = [];  //saljemo listu Activitydto
    public TCursor? NextCursor { get; set; }
}