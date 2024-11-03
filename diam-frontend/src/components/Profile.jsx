import React, { useState } from 'react';

function Profile() {
  // Define state with initial data
  const [data] = useState([
    { id: 1, name: "Md Anas", img: 'https://picsum.photos/200/300', Bio: "I want to donate to NGO"},
  ]);
  const [balance, setBalance] = useState('');

  const [publicKey] = useState("GDWHFDWBLORGQ4I4SFY3AJ4Z3SWQ2V2KD7ZDEE7XF7EWYF5RJXCE2WHY");

  const handleClick = async () => {
    const response = await fetch(`http://localhost:3001/check-balance?publicKey=${publicKey}`);
    const data = await response.json();
    const balance = data.balanceInfo[0].balance;
    setBalance(balance);
  }

  return (
    <div className="w-1/2 m-auto">
      <div className="mt-20">
        {data.map((d) => (
          <div key={d.id} className="bg-blue-300 h-[500px] text-black rounded-xl mb-4">
            {/* Display card content */}
            <div>
              <div className="h-56 rounded-t-xl bg-blue-800 flex justify-center items-center">
                <img src={d.img} alt="logo" className="h-44 w-44 rounded-full" />
              </div>
              <div className="flex flex-col justify-center items-center gap-4 p-4">
                <p className="text-2xl font-bold">{d.name}</p>
                <p>{d.Bio}</p>
                <p>{publicKey}</p>
                <button
                  onClick={handleClick}
                  className="bg-black text-blue-300 text-lg px-6 py-1 rounded-xl"
                >
                  Check Balance
                </button>
                <p>{balance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
