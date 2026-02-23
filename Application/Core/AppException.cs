using System;

namespace Application.Core; 


public class AppException(int statusCode, string message, string? details) //kao results samo za nepredvidjene greske kao npr pad baze 
{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;
}
