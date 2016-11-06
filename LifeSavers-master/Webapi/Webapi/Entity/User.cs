using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Webapi.Entity
{
    public class User : BaseEntity
    {
        private string _fullname;
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override Guid Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Fullname
        {
            get { return string.Format($"{FirstName} {LastName}"); }
            set { _fullname = FirstName + " " + LastName; }
        }

        [Required]
        public string Email { get; set; }

        //Address
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
        public string State { get; set; }

        //public virtual Illness Illness { get; set; }

        //public virtual UserProfile UserProfile { get; set; }

        //public virtual UserType UserType { get; set; }
    }
}