import './PostRecipePage.scss';
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function PostRecipePage() {
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    }    

    return (
        <div className="post-recipe-page">
        <div className="post-recipe-page-content">
            <div className="page-header">Post Recipe</div>
            <div className="recipe-form-wrapper">
                <form className="recipe-form" id="recipe-form" onSubmit={handleSubmit}>
                    <div className="title-section section">
                        <div>Title</div>
                        <input placeholder="Enter title" required></input>
                    </div>
                    <div className="desc-section section">
                        <div>Description</div>
                        <textarea placeholder="Enter description" required></textarea>
                    </div>
                    <div className="images-section section">
                        <div>Images</div>
                        <input type='file' accept='image/*' multiple='mulitple' required></input>
                    </div>
                    <div className="ingr-section section">
                        <div>Ingredients</div>
                        <div className="ingr-added-section">
                            {ingredients?.length > 0 &&
                                ingredients.map((item, index) => {
                                    return (
                                        <div>
                                            {item}
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
                            <input className="ingr-add-input-name" placeholder='Enter ingredient name' required></input>
                            </div>
                            <div className='col2'>
                            <input className="ingr-add-input-quantity" placeholder='Enter quantity' type='number' min='0' required></input>
                            </div>
                            <div className="ingr-add-btn add-icon col3"><AddCircleOutlineIcon /></div>
                        </div>
                    </div>
                    <div className="servings-section section">
                        <div>Servings</div>
                        <input placeholder="Enter amount" type='number' min='0' required></input>
                    </div>
                    <div className="time-section section">
                        <div>Cooking time</div>
                        <div className="time-section-input-wrapper">
                        <div className='col1'>
                            <div>hour(s):</div><input placeholder="Enter hour(s)" type='number' min='0' required></input>
                        </div>
                        <div className='col2'>
                            <div>min(s):</div><input placeholder="Enter min(s)" type='number' min='0' max='59' required></input>
                        </div>
                        </div>
                    </div>
                    <div className="steps-section section">
                        Steps
                        <div className="steps-added-section">
                            {steps?.length > 0 &&
                                steps.map((item) => {
                                    return (
                                        <div>
                                            {item}
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
                            <textarea className="steps-add-input-name" placeholder='Enter step description' required></textarea>
                            </div>
                            <div className="steps-add-btn add-icon col2"><AddCircleOutlineIcon /></div>
                        </div>
                    </div>
                    <div className='post-btn-wrapper'><button type="submit" className="post-btn">Post Recipe</button></div>
                </form>
            </div>
        </div>
        </div>
    )
}