import { Button, CircularProgress } from "@mui/material";
import Header from "../../userinterface/homepage/Header";
import Footer from "../../userinterface/homepage/Footer";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../../context/maincontext";
import { useParams } from "react-router-dom";
import BackDrop from "../../userinterface/Backdrop";

export default function ShowDetails() {
   const { id } = useParams();
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const { getJournalDetail } = useContext(MainContext)
   const [data, setData] = useState({
      Abstract: "",
      Author_Name: "",
      Branch: "",
      Created_at: "",
      Journal_Type: "",
      Second_Author_Guide_Name: "",
      Title_of_paper: "",
      id: 0,
      subject: "",
      volume: 0,
      issue: 0,

   });

   useEffect(() => {
      if (!id) {
         console.warn("No ID found in query params");
         return;
      }
      async function fetchdata() {
         setLoading(true)
         try {
            const data = await getJournalDetail(id)
            setData({
               Abstract: data[0].Abstract,
               Author_Name: data[0].Author_Name,
               Branch: data[0].Branch,
               Created_at: data[0].Created_at,
               Journal_Type: data[0].Journal_Type,
               Second_Author_Guide_Name: data[0].Second_Author_Guide_Name,
               Title_of_paper: data[0].Title_of_paper,
               id: data[0].id,
               subject: data[0].subject,
               volume: data[0].Volume,
               issue: data[0].Issue
            })
            setLoading(false)
         }
         catch (e) {
            console.log(e)
            setLoading(false)
         }
      }
      fetchdata()
   }, [id, getJournalDetail])

   const handleCertificateDownload = async (id) => {
      try {
         setOpen(true);
         console.log(`Downloading file with ID: ${id}`);
         const response = await axios.post(
            `https://varsharesearchorganization.com/api/v1/downloadCertificate/${id}`,
            // `http://localhost:5678/api/v1/downloadCertificate/${id}`,
            null,
            { responseType: "blob" }  // 🔥 Ensures binary data is handled correctly
         );

         if (response.data.size === 0) {
            console.error("Received an empty file!");
            setOpen(false);
            return;
         }

         const blob = new Blob([response.data], { type: "application/pdf" });
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${data.Title_of_paper}.pdf`);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setOpen(false);

      } catch (error) {
         console.error("Error downloading file:", error);
         setOpen(false);

      }
   };

   //  this function is use to download the authors updated journal

   const handleDownload = async (id) => {
      try {
         console.log(`Downloading file with ID: ${id}`);
         const response = await axios.post(
            `https://varsharesearchorganization.com/api/v1/download/${id}`,
            // `http://localhost:5678/api/v1/download/${id}`,
            null,
            { responseType: "blob" }  // 🔥 Ensures binary data is handled correctly
         );

         if (response.data.size === 0) {
            console.error("Received an empty file!");
            return;
         }

         const blob = new Blob([response.data], { type: "application/pdf" });
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${data.Title_of_paper}.pdf`);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
      } catch (error) {
         console.error("Error downloading file:", error);
      }
   };

   return (
      <div>
         <div>
            <Header />
         </div>
         <BackDrop open={open} />
         {loading ? <CircularProgress size="3rem" /> : (<>
            <div style={{ marginTop: 40, fontSize: 24, fontWeight: 'bold', letterSpacing: 0.5, width: '70%', height: '100%', textAlign: 'center', marginLeft: '12%' }}>{data.Title_of_paper}</div>

            <div style={{ marginTop: 20, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <b>Author(S):</b> {data.Author_Name} , {data.Second_Author_Guide_Name}
            </div>

            <div style={{ marginTop: 7, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <b>Publication #:</b> {data.id}
            </div>

            <div style={{ marginTop: 7, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <b>Date of Publication:</b> {new Date(data.Created_at).toLocaleDateString()}
            </div>

            <div style={{ marginTop: 7, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <b>Country:</b> India
            </div>

            {/* <div style={{ marginTop: 7, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
            <b>Pages:</b> 1-7
         </div> */}

            <div style={{ marginTop: 7, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <b>Published In:</b> Volume {data.volume} Issue {data.issue} : {new Date(data.Created_at).getMonth() + 1}-{new Date(data.Created_at).getFullYear()}
            </div>

            <div style={{ marginTop: 8, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <div style={{ fontWeight: 600, marginBottom: 5 }}>Abstract</div>
               <div style={{ fontSize: 16 }}>{data.Abstract}</div>
            </div>

            <div style={{ marginTop: 20, fontWeight: 400, fontSize: ' 1.2rem', marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               <span style={{ fontWeight: 600, marginBottom: 5 }}>Keywords:</span> <span style={{ fontSize: 17 }}>Electronic Evidence, Indian Evidence Act, Judicial Reform, Digital Forensics, Legal Admissibility.</span>
            </div>



            <div style={{ textAlign: "center", marginTop: 40, marginBottom: 20 }}>
               <Button variant="contained" color="primary" onClick={() => handleDownload(data.id)}>Download/View Paper PDF</Button>
               <Button style={{ marginLeft: 10 }} onClick={() => handleCertificateDownload(data.id)} variant="contained" color="success">Download Certificate </Button>
            </div>

            <div style={{ marginTop: 50, fontWeight: 400, fontSize: 18, marginLeft: '7%', letterSpacing: 0.3, marginRight: '7%' }}>
               Share this Article

               <div style={{ marginTop: 5, cursor: 'pointer', fontSize: 20 }}>
                  <WhatsAppIcon style={{ color: '#25D366', fontSize: 30 }} />
                  <FacebookIcon style={{ color: '#1877F2', marginLeft: 5, fontSize: 30 }} />
                  <TwitterIcon style={{ color: '#1DA1F2', marginLeft: 5, fontSize: 30 }} />
                  <LinkedInIcon style={{ color: '#0077B5', marginLeft: 5, fontSize: 30 }} />
                  <TelegramIcon style={{ color: '#0088cc', marginLeft: 5, fontSize: 30 }} />

               </div>

            </div>

         </>)}
         <div style={{ marginTop: 10 }}>
            <Footer />
         </div>

      </div>
   );
}
