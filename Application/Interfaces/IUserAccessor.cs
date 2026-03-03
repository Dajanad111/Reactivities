using System;
using Domain;

namespace Application.Interfaces;

//pravimo ovo da bi mogli da dobijemo usera a da ne znamo nista o njemu 
public interface IUserAccessor 
{
    string GetUserId(); //trebace nam user id
    Task<User> GetUserAsync(); //task koji vraca User i zvacemo ga GetUserAsync
}