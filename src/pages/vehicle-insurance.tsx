import React, { useState, useEffect } from 'react';
function VehicleInsurance() {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [formData, setFormData] = useState({
        sumInsured: '',
        vehicleType: 'car',
        driverAge: '',
        carExtras: {
            antiTheftSystem: false
        },
        addOns: {
            roadsideAssistance: false,
            theftProtection: false,
            accidentProtection: false
        },
    });
    const [sumInsuredError, setSumInsuredError] = useState('');

    useEffect(() => {
        document.title = "Vehicle Insurance";
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (name === 'sumInsured') {
            // Check if sumInsured is greater than 0
            if (parseFloat(value) <= 0) {
                setSumInsuredError('Sum Insured must be greater than 0.');
            } else {
                setSumInsuredError('');
            }
        }

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                carExtras: {
                    ...prevData.carExtras,
                    [name]: checked,
                },
                addOns: {
                    ...prevData.addOns,
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Function to calculate the yearly premium
    const calculatePremium = () => {
        const { sumInsured, vehicleType, driverAge, addOns, carExtras } = formData;

        let basePremiumRate = 0;
        let riskSurcharge = 0;
        let discount = 0;
        let addOnsCost = 0;

        // Determine the base premium rate based on sum insured and vehicle type
        if (parseFloat(sumInsured) <= 10000) {
            switch (vehicleType) {
                case 'car':
                    basePremiumRate = 0.02;
                    break;
                case 'motorcycle':
                    basePremiumRate = 0.025;
                    break;
                case 'truck':
                    basePremiumRate = 0.03;
                    break;
                case 'electric':
                    basePremiumRate = 0.018;
                    break;
                default:
                    basePremiumRate = 0.02;
            }
        } else if (parseFloat(sumInsured) <= 50000) {
            switch (vehicleType) {
                case 'car':
                    basePremiumRate = 0.018;
                    break;
                case 'motorcycle':
                    basePremiumRate = 0.023;
                    break;
                case 'truck':
                    basePremiumRate = 0.027;
                    break;
                case 'electric':
                    basePremiumRate = 0.015;
                    break;
                default:
                    basePremiumRate = 0.018;
            }
        } else {
            switch (vehicleType) {
                case 'car':
                    basePremiumRate = 0.015;
                    break;
                case 'motorcycle':
                    basePremiumRate = 0.02;
                    break;
                case 'truck':
                    basePremiumRate = 0.025;
                    break;
                case 'electric':
                    basePremiumRate = 0.012;
                    break;
                default:
                    basePremiumRate = 0.015;
            }
        }

        // Apply surcharges based on driver's age
        if (parseInt(driverAge) <= 25) {
            riskSurcharge = 0.1; // 10% surcharge
        } else if (parseInt(driverAge) >= 65) {
            riskSurcharge = 0.08; // 8% surcharge
        }

        // Apply discount for anti-theft system (assuming it's part of formData)
        if (carExtras.antiTheftSystem) {
            // BUG: This should be 0.05 for 5% discount
            discount = 0.5; // 5% discount
        }

        // Apply add-ons costs
        if (addOns.roadsideAssistance) addOnsCost += 50; // Roadside Assistance cost
        if (addOns.theftProtection) addOnsCost += (parseFloat(sumInsured) * 0.05); // Theft Protection cost
        if (addOns.accidentProtection) addOnsCost += (parseFloat(sumInsured) * 0.03); // Accident Protection cost

        // Calculate the final premium using the formula
        const premium =
            (parseFloat(sumInsured) * basePremiumRate) +
            (parseFloat(sumInsured) * basePremiumRate * riskSurcharge) -
            (parseFloat(sumInsured) * basePremiumRate * discount) +  // Apply discount here
            addOnsCost;

        return { premium: premium.toFixed(2), breakdown: generateBreakdown(basePremiumRate, riskSurcharge, discount, addOnsCost) }; // Return premium and breakdown explanation
    };

    // Function to generate the breakdown
    const generateBreakdown = (basePremiumRate: number, riskSurcharge: number, discount: number, addOnsCost: number) => {
        const { sumInsured, addOns } = formData;
        const breakdown = [];

        // Breakdown for base premium rate
        breakdown.push(`Base Premium Rate (${basePremiumRate * 100}%): $${(parseFloat(sumInsured) * basePremiumRate).toFixed(2)}`);

        // Breakdown for risk surcharge
        if (riskSurcharge > 0) {
            breakdown.push(`Risk Surcharge (${riskSurcharge * 100}% due to age): $${(parseFloat(sumInsured) * basePremiumRate * riskSurcharge).toFixed(2)}`);
        }

        // Breakdown for discount
        if (discount > 0) {
            breakdown.push(`Discount (-${discount * 100}% for Anti-Theft System): -$${(parseFloat(sumInsured) * basePremiumRate * discount).toFixed(2)}`);
        }

        // Breakdown for add-ons
        if (addOns.roadsideAssistance) breakdown.push(`Add-On: Roadside Assistance: $50`);
        if (addOns.theftProtection) breakdown.push(`Add-On: Theft Protection (5% of Sum Insured): $${(parseFloat(sumInsured) * 0.05).toFixed(2)}`);
        if (addOns.accidentProtection) breakdown.push(`Add-On: Accident Protection (3% of Sum Insured): $${(parseFloat(sumInsured) * 0.03).toFixed(2)}`);

        // Breakdown for total add-ons cost
        breakdown.push(`Total Add-Ons: $${addOnsCost.toFixed(2)}`);

        return breakdown;
    };

    // Function to check if the form is valid (i.e., no empty fields)
    const isFormValid = () => {
        return formData.sumInsured && formData.driverAge && formData.vehicleType && formData.vehicleType && parseFloat(formData.sumInsured) > 0;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh', padding: '20px', }} >
            <h1 style={{ marginBottom: '20px' }}>Vehicle Insurance</h1>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', }} >
                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>
                    Sum Insured (Vehicle Value):
                    <input type="number" name="sumInsured" value={formData.sumInsured} onChange={handleChange} style={{ width: '93%', padding: '8px', marginBottom: '15px' }} />
                    {sumInsuredError && <div style={{ color: 'red', marginBottom: '10px' }}>{sumInsuredError}</div>}
                </label>
                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>
                    Vehicle Type:
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '15px',
                            fontSize: '14px',
                        }}
                    >
                        <option value="car">Car</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="truck">Truck</option>
                        <option value="electric">Electric</option>
                    </select>
                </label>

                <label
                    style={{
                        fontSize: '14px',
                        marginBottom: '10px',
                        display: 'block',
                        fontWeight: 'bold',
                    }}
                >
                    Driver's Age:
                    <input
                        type="number"
                        name="driverAge"
                        value={formData.driverAge}
                        onChange={handleChange}
                        style={{ width: '93%', padding: '8px', marginBottom: '15px' }}
                    />
                </label>
                <fieldset style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '5px', }} >
                    <legend style={{ fontWeight: 'bold' }}>Car Extras</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="antiTheftSystem"
                            checked={formData.carExtras.antiTheftSystem}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Anti-Theft System
                    </label>
                </fieldset>
                <fieldset style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '5px' }} >
                    <legend style={{ fontWeight: 'bold' }}>Add-Ons</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="roadsideAssistance"
                            checked={formData.addOns.roadsideAssistance}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Roadside Assistance
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="theftProtection"
                            checked={formData.addOns.theftProtection}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Theft Protection
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="theftProtection"
                            checked={formData.addOns.accidentProtection}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Accident Protection
                    </label>
                </fieldset>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    <button type="button" className='secondary-button' disabled={!isFormValid()} onClick={() => alert('Yearly Premium: $' + calculatePremium().premium)} >
                        Calculate Yearly Premium
                    </button>
                    <button type="button" className='primary-button' disabled={!isFormValid()} onClick={() => setShowBreakdown(!showBreakdown)}>
                        {showBreakdown ? 'Show Yearly Premium Breakdown' : 'Hide Yearly Premium Breakdown'}
                    </button>
                    <button type="button" className='primary-button' disabled={!isFormValid()} onClick={() => alert('Not implemented!')}>
                        Share Insurance Offer
                    </button>
                    <button type="button" className='secondary-button' disabled={!isFormValid()} onClick={() => alert('Payment processed!')}>
                        Proceed to payment
                    </button>
                    {showBreakdown && (
                        <div style={{ marginTop: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', }}>
                            <h4>Premium Breakdown:</h4>
                            <ul>
                                {calculatePremium().breakdown.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VehicleInsurance;
