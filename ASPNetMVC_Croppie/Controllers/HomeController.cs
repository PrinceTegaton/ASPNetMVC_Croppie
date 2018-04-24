using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AspNetMVC_Croppie.Controllers
{
    public class HomeController : Controller
    {
        static string ReturnMessage;

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadCroppedAvatar(string UserID, string ImageData)
        {
            if (UploadAvatar(UserID, ImageData))
            {
                return Json(new { status = 200, message = ReturnMessage });
            }

            return Json(new { status = 0, message = ReturnMessage });
        }

        public bool UploadAvatar(string UserID, string Base64String)
        {
            if (string.IsNullOrEmpty(Base64String))
            {
                ReturnMessage = "Profile picture upload failed. No data from photo!";
                return false;
            }

            string filename = Server.MapPath($"~/Avatars/{UserID}.jpg");

            if (Base64ImageToFile(Base64String, filename, System.Drawing.Imaging.ImageFormat.Jpeg))
            {
                ReturnMessage = "Profile picture uploaded successfully!";
                return true;
            }

            ReturnMessage = "Failure uploading your profile picture!";
            return false;
        }
        
        public bool Base64ImageToFile(string Base64String, string SaveAs, System.Drawing.Imaging.ImageFormat Format)
        {
            try
            {
                //Remove this part "data:image/jpeg;base64,"
                Base64String = Base64String.Split(',')[1];
                byte[] bytes = Convert.FromBase64String(Base64String);

                Image image;
                using (var ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);
                }
                image.Save(SaveAs, Format);
                return true;
            }
            catch (Exception ex)
            {
                ReturnMessage = ex.Message;
                return false;
            }
        }
    }
}