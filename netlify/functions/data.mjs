import { getStore } from "@netlify/blobs";

const SITE_ID = "959175d1-fe9b-401d-b485-bf13b18b0a21";
const TOKEN = "nfp_YDJhPekCEzEkxpFhvZMFgcdHhzrKeRCfb5c0";

const DEFAULTS = {
  props: [
    {id:1,name:"Lake Anna Lot 1",price:"$699,000",loc:"Lake Anna, VA",beds:0,baths:0,sqft:3200,type:"Lake Anna",status:"Available",desc:"Modern 3,200 sq ft two-level concept on a premium Lake Anna lot. Available as land only, with a featured Dashing Developments home package, or fully custom build.",photos:[],video:"",hero:true,showcase:true},
    {id:2,name:"Lake Anna Lot 2",price:"$699,000",loc:"Lake Anna, VA",beds:4,baths:4,sqft:0,type:"Lake Anna",status:"Available",desc:"4 bed / 4 bath high-ceiling modern package on a premium Lake Anna lot. Flexible home package options available, or build fully custom.",photos:[],video:"",hero:true,showcase:true},
    {id:3,name:"Lancaster Property 1",price:"$340,000",loc:"Lancaster, VA",beds:0,baths:0,sqft:1600,type:"Lancaster",status:"Available",desc:"1,600 sq ft modern open concept homesite in Lancaster County. Available as land only, featured package, or fully custom build.",photos:[],video:"",hero:false,showcase:true},
    {id:4,name:"Lancaster Property 2",price:"$340,000",loc:"Lancaster, VA",beds:3,baths:2.5,sqft:0,type:"Lancaster",status:"Available",desc:"3 bed / 2.5 bath Lancaster County homesite with buyer selections available.",photos:[],video:"",hero:false,showcase:true},
    {id:5,name:"Lancaster Property 3",price:"$340,000",loc:"Lancaster, VA",beds:0,baths:0,sqft:0,type:"Lancaster",status:"Available",desc:"Lancaster County homesite featuring 10 foot ceilings and 2-car garage options.",photos:[],video:"",hero:false,showcase:true},
    {id:6,name:"Lancaster Property 4",price:"$340,000",loc:"Lancaster, VA",beds:0,baths:0,sqft:0,type:"Lancaster",status:"Available",desc:"Lancaster County homesite with colors and finishes available to buyer selection.",photos:[],video:"",hero:false,showcase:true}
  ],
  team: [
    {id:1,name:"Jerry Farzayee",role:"Founder & Licensed General Contractor",email:"jerry@farzayee.com",bio:"Jerry Farzayee is the founder of Dashing Developments LLC and a licensed general contractor focused on custom residential development. He built his own home while acting as his own general contractor before becoming formally licensed.",photo:""},
    {id:2,name:"Yousef Farzayee",role:"Project & Construction Manager",email:"",bio:"Yousef Farzayee serves as Project & Construction Manager for Dashing Developments. He is studying construction and focused on project management, field coordination, and day-to-day execution.",photo:""}
  ],
  models: [
    {id:1,name:"The Lake Anna Modern",style:"Lake Anna",price:"From $699,000",beds:4,baths:4,sqft:3200,garage:"2-Car Garage",desc:"A modern two-level design with high ceilings, open-concept living, and premium finishes. Board and batten exterior, metal roof, covered porch.",lots:"Lake Anna Lot 1, Lake Anna Lot 2",photos:[],visible:true},
    {id:2,name:"The Lancaster Classic",style:"Lancaster",price:"From $340,000",beds:3,baths:2.5,sqft:1600,garage:"2-Car Garage",desc:"A smart single-story plan for our Lancaster County homesites. Modern open concept with 10 foot ceilings and flexible finishes.",lots:"Lancaster Properties 1-4",photos:[],visible:true},
    {id:3,name:"The Northern Virginia Custom",style:"Two Story",price:"Call for Pricing",beds:4,baths:3,sqft:2800,garage:"2-Car Garage",desc:"A flexible two-story design for Northern Virginia lots with customizable square footage, elevations, and full finish selections.",lots:"Any Northern Virginia lot",photos:[],visible:true}
  ],
  leads: [],
  hero: null,
  settings: {name:"Dashing Developments LLC",phone:"(703) 944-6419",email:"jerry@farzayee.com",addr:"11900 Washington St, Fairfax, VA 22030"},
  pw: "admin123"
};

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  try {
    const db = getStore({
      name: "dashing-db",
      siteID: SITE_ID,
      token: TOKEN,
      consistency: "strong"
    });

    if (req.method === "GET") {
      const keys = ["props","team","models","leads","hero","settings","pw"];
      const data = {};
      for (const key of keys) {
        try {
          const val = await db.get(key, { type: "json" });
          data[key] = (val !== null && val !== undefined) ? val : DEFAULTS[key];
        } catch {
          data[key] = DEFAULTS[key];
        }
      }
      return new Response(JSON.stringify(data), { status: 200, headers });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action, key, value } = body;
      if (action === "set") {
        await db.setJSON(key, value);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  } catch (err) {
    console.error("data.mjs error:", err);
    return new Response(JSON.stringify(DEFAULTS), { status: 200, headers });
  }
};

export const config = { path: "/api/data" };
