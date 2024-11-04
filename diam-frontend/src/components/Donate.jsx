import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function Donate() {

  const [formVisible, setFormVisible] = useState({});
  const [datas, setDatas] = useState(datas_);
  const [loading, setLoading] = useState(false);
  const [ngosWithBalances, setNgosWithBalances] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const updatedNgos = await Promise.all(datas.map(async (ngo) => {
          const response = await axios.get(`http://localhost:3001/check-balance?publicKey=${ngo.publicKey}`);
          const balance = response.data.balanceInfo[0].balance;

          return {
            ...ngo,
            balance,
          };
        }));

        // setNgosWithBalances(updatedNgos);
        setDatas(updatedNgos);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Handle form toggle
  const handleDonateClick = (id) => {
    setFormVisible((prev) => ({ ...prev, [id]: true }));
  };

  const handleBackClick = (id) => {
    setFormVisible((prev) => ({ ...prev, [id]: false }));
  };

  // Handle form submission with alert
  const handleFormSubmit = async (e, id, publicKey) => {
    e.preventDefault();
    //Make payment
    setLoading(true);
    const url = "http://localhost:3001/pay";
    const body = {
      sender: "SB7AZA43R365YZOUXECDY7S4LZ74RUK6WK6E7H6JHJYNG2IV5PGQYYSU",
      receiver: publicKey,
      amount: amount,
    };
    try {
      const response = await axios.post(url, body);

      const responseBal = await axios.get(`http://localhost:3001/check-balance?publicKey=${publicKey}`);
      const balance = responseBal.data.balanceInfo[0].balance;

      setDatas((prev) => {
        prev.map((ngo) =>
          ngo.publicKey === publicKey ? { ...ngo, balance } : ngo
        )
      })
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error making the POST request:", error);
    }
    //End
    alert("Donation Successful!");
    handleBackClick(id); // Hide the form and return to the card view
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  }

  return (
    <div className="w-1/4 m-auto">
      <div className="mt-20">
        <Slider {...settings}>
          {datas.map((d) => (
            <div
              key={d.id}
              className="bg-blue-300 h-[550px] text-black rounded-xl"
            >
              {!formVisible[d.id] ? (
                // Display card content
                <div>
                  <div className="h-56 rounded-t-xl bg-blue-300 flex justify-center items-center">
                    <img
                      src={d.img}
                      alt="logo"
                      className="h-44 w-44 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <p className="text-2xl font-bold">{d.name}</p>
                    <p className="text-center">{d.description}</p>
                    <p className="text-xl font-semibold">{d.goal}</p>
                    <p className="text-xl font-semibold">Received - {d.balance}</p>
                    <button
                      onClick={() => handleDonateClick(d.id)}
                      className="bg-black text-blue-300 text-lg px-6 py-1 rounded-xl"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              ) : (
                //  donation form
                <div className="flex flex-col justify-center items-center gap-4 p-4">
                  <h3 className="text-2xl font-bold">Donate to {d.name}</h3>
                  <form
                    className="w-full max-w-xs"
                    onSubmit={(e) => handleFormSubmit(e, d.id, d.publicKey)}
                  >
                    <label className="block text-sm font-bold mb-2">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 mb-4 border rounded text-white"
                      placeholder="Enter your name"
                      required
                    />
                    <label className="block text-sm font-bold mb-2">
                      Donation Amount:
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 mb-4 border rounded text-white"
                      placeholder="Enter amount"
                      required
                      value={amount}
                      onChange={()=>handleChange(event)}
                    />
                    <label className="block text-sm font-bold mb-2">
                      Payment Method:
                    </label>
                    <select className="w-full p-2 mb-4 border rounded text-gray-400">
                      <option value="diams">DIAMS</option>
                    </select>
                    <label className="block text-sm font-bold mb-2">Key:</label>
                    <select className="w-full p-2 mb-4 border rounded text-gray-400">
                      <option value="key">{d.publicKey}</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full bg-black text-blue-300 py-2 rounded"
                    >
                      Submit Donation
                    </button>
                  </form>
                  <button
                    onClick={() => handleBackClick(d.id)}
                    className="text-black mt-2 underline"
                  >
                    Cancel
                  </button>
                  {loading && (<p>Donation in progress...</p>)}
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

const datas_ = [
  {
    id: 1,
    name: "Sahid's NGO",
    img: "https://picsum.photos/200/300",
    description: "Empowering Change, Transforming Lives.",
    goal: "NEED: 70000 DIAMS",
    publicKey: "GAACLTHXB24QZCDB4BJB6DO5MWHRUMESTK5SDPEBTYKVF4DJT2XO54GJ",
  },
  {
    id: 2,
    name: "Garvit's NGO",
    img: "https://picsum.photos/200/300",
    description: "Lending a Hand in Crisis Relief.",
    goal: "NEED: 50000 DIAMS",
    publicKey: "GCC3DVDGR7XD4QEZSM756AFJUU4FX46O7RBSMUSLUPS6EH6FFHJ3P7A4",
  },
  {
    id: 3,
    name: "Pranjal's NGO",
    img: "https://picsum.photos/200/300",
    description: "Advocating for a Sustainable Future.",
    goal: "NEED: 65000 DIAMS",
    publicKey: "GBFGMUCHULW4M6GGU53QGRA3NDGSN5W2FNLUPUTM2PYB2ISY3HTBPJY7",
  },
  {
    id: 4,
    name: "Anas's NGO",
    img: "https://picsum.photos/200/300",
    description: "Bridging the Gap to Quality Education.",
    goal: "NEED: 30000 DIAMS",
    publicKey: "GARC42YCVKTSDGMKIMASSTOIBKZ7UH26RMCBGR3UT2364F2OHQI6MTUM",
  },
];

export default Donate;
