namespace OpenPetroleum.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class OPs_Events
    {
        public int? Facility_ID { get; set; }

        public int? Event_ID { get; set; }

        [StringLength(255)]
        public string Site_Name { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(255)]
        public string City_State_Zip { get; set; }

        public DateTime? Date_of_Release { get; set; }

        [StringLength(255)]
        public string Status { get; set; }

        [StringLength(255)]
        public string OPS_Contact_Name { get; set; }

        [StringLength(255)]
        public string Phone { get; set; }

        [StringLength(255)]
        public string Email { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        [StringLength(255)]
        public string Status_Type { get; set; }

        public DateTime? Closure_Date { get; set; }

        public int ID { get; set; }
    }
}
