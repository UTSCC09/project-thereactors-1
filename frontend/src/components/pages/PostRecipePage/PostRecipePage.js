import './PostRecipePage.scss';
import React, { useEffect, useState } from "react";
import cloneDeep from 'lodash/cloneDeep';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function PostRecipePage() {
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {

    }, []);

    const handleAddIngr = () => {
        if (document.getElementById('ingr-desc').value === '' || document.getElementById('ingr-quantity').value === '') {
            document.getElementById('missing-ingr-warning').style.visibility = 'visible';
            document.getElementById('missing-ingr-warning').innerHTML = '*description or quantity missing';
            setTimeout(() => {
                document.getElementById('missing-ingr-warning').style.visibility = 'hidden';
            }, 5000);
        }
        else {
            let temp = cloneDeep(ingredients);
            temp.push({
                description: document.getElementById('ingr-desc').value,
                quantity: document.getElementById('ingr-quantity').value
            });
            setIngredients(temp);
            document.getElementById('ingr-desc').value = '';
            document.getElementById('ingr-quantity').value = '';
        }
    }

    const handleAddStep = () => {
        if (document.getElementById('step-desc').value === '') {
            document.getElementById('missing-step-warning').style.visibility = 'visible';
            document.getElementById('missing-step-warning').innerHTML = '*description missing';
            setTimeout(() => {
                document.getElementById('missing-step-warning').style.visibility = 'hidden';
            }, 5000);
        }
        else {
            let temp = cloneDeep(steps);
            temp.push(document.getElementById('step-desc').value);
            setSteps(temp);
            document.getElementById('step-desc').value = '';
        }
    }

    const handleDeleteIngr = (index) => {
        let temp = cloneDeep(ingredients);
        temp.splice(index, 1);
        console.log(temp);
        setIngredients(temp);
    }

    const handleDeleteStep = (index) => {
        let temp = cloneDeep(steps);
        temp.splice(index, 1);
        setSteps(temp);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ingredients.length === 0) {
            document.getElementById('missing-ingr-warning').style.visibility = 'visible';
            document.getElementById('missing-ingr-warning').innerHTML = '*ingredient missing';
            setTimeout(() => {
                document.getElementById('missing-ingr-warning').style.visibility = 'hidden';
            }, 5000);
        }
        if (steps.length === 0) {
            document.getElementById('missing-step-warning').style.visibility = 'visible';
            document.getElementById('missing-step-warning').innerHTML = '*step missing';
            setTimeout(() => {
                document.getElementById('missing-step-warning').style.visibility = 'hidden';
            }, 5000);
        }
        else { // all info present
            // make api call
        }
    }    

    return (
        <div className="post-recipe-page">
            <div className="recipe-form-wrapper">
                <div className="page-header">Post Recipe</div>
                <form className="recipe-form" id="recipe-form" onSubmit={handleSubmit}>
                    <div className="title-section section">
                        <div className='header'>Title</div>
                        <input className='form-input' placeholder="Enter title" required></input>
                    </div>
                    <div className="desc-section section">
                        <div className='header'>Description</div>
                        <textarea className='form-input' placeholder="Enter description" required></textarea>
                    </div>
                    <div className="images-section section">
                        <div className='header'>Images</div>
                        <input className='form-input' type='file' accept='image/*' multiple='mulitple' required></input>
                    </div>
                    <div className="ingr-section section">
                        <div className='header'>Ingredients<span id='missing-ingr-warning' className='item-missing-warning'></span></div>
                        <div className="added-section">
                            {ingredients?.length > 0 &&
                                ingredients.map((item, index) => {
                                    return (
                                        <div className='added-item' key={index}>
                                            <div>{item.quantity} {item.description}</div>
                                            <HighlightOffIcon onClick={()=>handleDeleteIngr(index)} />
                                        </div>
                                    )
                                })
                            }
                            {ingredients?.length === 0 &&
                                <div className='no-item-message'>
                                    No ingredients yet
                                </div>
                            }
                        </div>
                        <div className="ingr-add-section">
                            <div className='col1'>
                            <input className="ingr-add-input-name form-input" id='ingr-desc' placeholder='Enter ingredient desc.'></input>
                            </div>
                            <div className='col2'>
                            <input className="ingr-add-input-quantity form-input" id='ingr-quantity' placeholder='Enter quantity' type='number' min='0'></input>
                            </div>
                            <div className="ingr-add-btn add-icon col3"><AddCircleOutlineIcon onClick={handleAddIngr} /></div>
                        </div>
                    </div>
                    <div className="servings-section section">
                        <div className='header'>Servings</div>
                        <input className='form-input' placeholder="Enter servings amount" type='number' min='0' required></input>
                    </div>
                    <div className="time-section section">
                        <div className='header'>Cooking time</div>
                        <div className="time-section-input-wrapper">
                        <div className='col1'>
                            <div>hour(s):</div><input className='form-input' placeholder="Enter hour(s)" type='number' min='0' required></input>
                        </div>
                        <div className='col2'>
                            <div>min(s):</div><input className='form-input' placeholder="Enter min(s)" type='number' min='0' max='59' required></input>
                        </div>
                        </div>
                    </div>
                    <div className="steps-section section">
                        <div className='header'>Steps<span id='missing-step-warning' className='item-missing-warning'></span></div>
                        <div className="added-section">
                            {steps?.length > 0 &&
                                steps.map((item, index) => {
                                    return (
                                        <div className='added-item' key={index}>
                                            <div>{item}</div>
                                            <HighlightOffIcon onClick={()=>handleDeleteStep(index)} />
                                        </div>
                                    )
                                })
                            }
                            {steps?.length === 0 &&
                                <div className='no-item-message'>
                                    No steps yet
                                </div>
                            }
                        </div>
                        <div className="steps-add-section">
                            <div className='col1'>
                            <textarea className="steps-add-input-name form-input" id='step-desc' placeholder='Enter step description'></textarea>
                            </div>
                            <div className="steps-add-btn add-icon col2"><AddCircleOutlineIcon onClick={handleAddStep} /></div>
                        </div>
                    </div>
                    <div className='post-btn-wrapper'><button type="submit" className="post-btn">Post Recipe</button></div>
                </form>
            </div>
        </div>
    )
}