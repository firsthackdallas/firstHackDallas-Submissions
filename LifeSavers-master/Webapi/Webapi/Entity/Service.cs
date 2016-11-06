using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Webapi.Entity
{
    public class Service : BaseEntity
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override Guid Id { get; set; }
        public string ServiceName { get; set; }
        public string Description { get; set; }
        public bool IsEligible { get; set; }
        public string FaithBased { get; set; }
        public string RequiredDocuments { get; set; }
        public List<Guid> ServiceTypeId { get; set; }
        public virtual List<ServiceType> ServiceType { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
        public string State { get; set; }
        public string Hours { get; set; }
        public string Url { get; set; }

    }
}