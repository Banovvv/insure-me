import React, { useState, useEffect } from 'react';

function HealthInsurance() {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [formData, setFormData] = useState({
        sumInsured: '',
        age: '',
        coverageType: 'basic',
        smoker: false,
        obese: false,
        gymMembership: false,
        preExistingCondition: false,
        addOns: {
            dentalVision: false,
            mentalHealth: false,
            criticalIllness: false
        },
    });
    const [ageError, setAgeError] = useState('');

    useEffect(() => {
        document.title = "Health Insurance";
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (name === 'age') {
            // Check if age is a valid number and within a reasonable range
            if (parseInt(value) < 18 || parseInt(value) > 100) {
                setAgeError('Age must be between 18 and 100.');
            } else {
                setAgeError('');
            }
        }

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
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
        const { age, coverageType, smoker, obese, gymMembership, preExistingCondition, addOns, sumInsured } = formData;

        let basePremiumRate = 0;
        let surcharge = 0;
        let discount = 0;
        let addOnsCost = 0;

        // Determine the base premium rate based on age and coverage type
        if (parseInt(age) >= 18 && parseInt(age) <= 30) {
            switch (coverageType) {
                case 'basic':
                    basePremiumRate = 0.03;
                    break;
                case 'standard':
                    basePremiumRate = 0.045;
                    break;
                case 'premium':
                    basePremiumRate = 0.06;
                    break;
                default:
                    basePremiumRate = 0.03;
            }
        } else if (parseInt(age) >= 31 && parseInt(age) <= 50) {
            switch (coverageType) {
                case 'basic':
                    basePremiumRate = 0.035;
                    break;
                case 'standard':
                    basePremiumRate = 0.05;
                    break;
                case 'premium':
                    basePremiumRate = 0.065;
                    break;
                default:
                    basePremiumRate = 0.035;
            }
        } else if (parseInt(age) >= 51) {
            switch (coverageType) {
                case 'basic':
                    basePremiumRate = 0.04;
                    break;
                case 'standard':
                    basePremiumRate = 0.055;
                    break;
                case 'premium':
                    basePremiumRate = 0.07;
                    break;
                default:
                    basePremiumRate = 0.04;
            }
        }

        // Apply surcharges based on lifestyle and health conditions
        if (smoker) surcharge += 0.1; // 10% surcharge for smokers
        if (obese) surcharge += 0.08; // 8% surcharge for obese individuals
        if (preExistingCondition) surcharge += 0.12; // 12% surcharge for pre-existing conditions

        // Apply discount for gym membership
        if (gymMembership) discount -= 0.05; // 5% discount for gym membership

        // Apply add-ons costs
        if (addOns.dentalVision) addOnsCost += 0.05; // 5% of base premium for dental & vision
        if (addOns.mentalHealth) addOnsCost += 0.03; // 3% of base premium for mental health coverage
        if (addOns.criticalIllness) addOnsCost += 0.07; // 7% of base premium for critical illness coverage

        // Calculate the final premium using the formula, incorporating sumInsured
        const premium =
            (basePremiumRate * parseFloat(sumInsured)) + // Base premium rate multiplied by sum insured
            ((basePremiumRate * parseFloat(sumInsured)) * surcharge) - // Apply surcharges
            ((basePremiumRate * parseFloat(sumInsured)) * discount) + // Apply discount
            (addOnsCost * parseFloat(sumInsured)); // Apply add-ons

        return { premium: premium.toFixed(2), breakdown: generateBreakdown(basePremiumRate, surcharge, discount, addOnsCost, parseFloat(sumInsured)) };
    };


    // Function to generate the breakdown
    const generateBreakdown = (basePremiumRate: number, surcharge: number, discount: number, addOnsCost: number, sumInsured: number) => {
        const breakdown = [];

        // Breakdown for base premium rate
        breakdown.push(`Base Premium Rate (${basePremiumRate * 100}%): $${(basePremiumRate * sumInsured).toFixed(2)}`);

        // Breakdown for surcharge
        if (surcharge > 0) {
            breakdown.push(`Surcharge due to lifestyle/health conditions: $${(basePremiumRate * sumInsured * surcharge).toFixed(2)}`);
        }

        // Breakdown for discount
        if (discount < 0) {
            breakdown.push(`Discount for Gym Membership: -$${(basePremiumRate * sumInsured * discount).toFixed(2)}`);
        }

        // Breakdown for add-ons
        if (addOnsCost > 0) {
            breakdown.push(`Add-On: Dental & Vision Coverage: $${(addOnsCost * sumInsured).toFixed(2)}`);
        }
        if (addOnsCost > 0) {
            breakdown.push(`Add-On: Mental Health & Therapy Coverage: $${(addOnsCost * sumInsured).toFixed(2)}`);
        }
        if (addOnsCost > 0) {
            breakdown.push(`Add-On: Critical Illness Coverage: $${(addOnsCost * sumInsured).toFixed(2)}`);
        }

        return breakdown;
    };


    // Function to check if the form is valid (i.e., no empty fields)
    const isFormValid = () => {
        return formData.age && formData.coverageType && parseInt(formData.age) >= 18 && parseInt(formData.age) <= 100;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh', padding: '20px', }} >
            <h1 style={{ marginBottom: '20px' }}>Health Insurance</h1>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', }} >
                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>
                    Sum Insured:
                    <input type="number" name="sumInsured" value={formData.sumInsured} onChange={handleChange} style={{ width: '93%', padding: '8px', marginBottom: '15px' }} />
                </label>
                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block', fontWeight: 'bold' }} >
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        style={{ width: '93%', padding: '8px', marginBottom: '15px' }}
                    />
                    {ageError && <div style={{ color: 'red', marginBottom: '10px' }}>{ageError}</div>}
                </label>
                <label style={{ fontSize: '14px', marginBottom: '10px', display: 'block', fontWeight: 'bold' }} >
                    Coverage Type:
                    <select
                        name="coverageType"
                        value={formData.coverageType}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '15px', fontSize: '14px' }}
                    >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                    </select>
                </label>

                <fieldset style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '5px' }} >
                    <legend style={{ fontWeight: 'bold' }}>Lifestyle & Health</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="smoker"
                            checked={formData.smoker}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Smoker
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="obese"
                            checked={formData.obese}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Obese (BMI ≥ 30)
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="gymMembership"
                            checked={formData.gymMembership}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Gym Membership (≥ 1 year)
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="preExistingCondition"
                            checked={formData.preExistingCondition}
                            onChange={handleChange}
                            style={{ marginRight: '10px' }}
                        />
                        Pre-existing Health Conditions
                    </label>
                </fieldset>

                <fieldset style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '5px' }} >
                    <legend style={{ fontWeight: 'bold' }}>Add-Ons</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="dentalVision"
                            checked={formData.addOns.dentalVision}
                            onChange={(e) => handleChange(e)}
                            style={{ marginRight: '10px' }}
                        />
                        Dental & Vision Coverage
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="mentalHealth"
                            checked={formData.addOns.mentalHealth}
                            onChange={(e) => handleChange(e)}
                            style={{ marginRight: '10px' }}
                        />
                        Mental Health & Therapy Coverage
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            name="criticalIllness"
                            checked={formData.addOns.criticalIllness}
                            onChange={(e) => handleChange(e)}
                            style={{ marginRight: '10px' }}
                        />
                        Critical Illness Coverage
                    </label>
                </fieldset>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    <button type="button" className='secondary-button' disabled={!isFormValid()} onClick={() => alert('Yearly Premium: $' + calculatePremium().premium)} >
                        Calculate Yearly Premium
                    </button>
                    <button type="button" className='primary-button' disabled={!isFormValid()} onClick={() => setShowBreakdown(!showBreakdown)}>
                        {showBreakdown ? 'Hide Yearly Premium Breakdown' : 'Show Yearly Premium Breakdown'}
                    </button>
                    <button type="button" className='primary-button' disabled={!isFormValid()}>
                        Share Insurance Offer
                    </button>
                    <button type="button" className='secondary-button' disabled={!isFormValid()}>
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

export default HealthInsurance;
