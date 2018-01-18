using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using OpenPetroleum.Models;

namespace OpenPetroleum.Controllers
{
    [Authorize]
    public class EventsController : Controller
    {
        private Events db = new Events();

        // GET: Events
        public ActionResult Index()
        {
            return View(db.OPs_Events.ToList());
        }

        // GET: Events/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            OPs_Events oPs_Events = db.OPs_Events.Find(id);
            if (oPs_Events == null)
            {
                return HttpNotFound();
            }
            return View(oPs_Events);
        }

        // GET: Events/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Events/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,Facility_ID,Event_ID,Site_Name,Address,City_State_Zip,Date_of_Release,Status,OPS_Contact_Name,Phone,Email,Latitude,Longitude,Status_Type,Closure_Date")] OPs_Events oPs_Events)
        {
            if (ModelState.IsValid)
            {
                db.OPs_Events.Add(oPs_Events);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(oPs_Events);
        }

        // GET: Events/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            OPs_Events oPs_Events = db.OPs_Events.Find(id);
            if (oPs_Events == null)
            {
                return HttpNotFound();
            }
            return View(oPs_Events);
        }

        // POST: Events/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,Facility_ID,Event_ID,Site_Name,Address,City_State_Zip,Date_of_Release,Status,OPS_Contact_Name,Phone,Email,Latitude,Longitude,Status_Type,Closure_Date")] OPs_Events oPs_Events)
        {
            if (ModelState.IsValid)
            {
                db.Entry(oPs_Events).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(oPs_Events);
        }

        // GET: Events/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            OPs_Events oPs_Events = db.OPs_Events.Find(id);
            if (oPs_Events == null)
            {
                return HttpNotFound();
            }
            return View(oPs_Events);
        }

        // POST: Events/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            OPs_Events oPs_Events = db.OPs_Events.Find(id);
            db.OPs_Events.Remove(oPs_Events);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
