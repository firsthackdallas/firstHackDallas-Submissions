using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Webapi.Entity
{
    public class ServiceType : BaseEntity
    {
        public override Guid Id { get; set; }
        public string Description { get; set; }
    }
}