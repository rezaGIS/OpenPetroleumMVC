using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OpenPetroleum.Models
{
    public class MapController : Controller
    {
        // GET: Map
        public ActionResult Index()
        {
            
            return View();
        }
    }
}