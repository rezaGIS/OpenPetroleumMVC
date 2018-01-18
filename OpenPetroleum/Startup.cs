using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(OpenPetroleum.Startup))]
namespace OpenPetroleum
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
