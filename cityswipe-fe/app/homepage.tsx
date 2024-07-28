'use client'

import { Button } from "@/components/ui/button";
import { useCitySwipe } from './citySwipeContext';
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import quizQuestions from "./quiz-questions/questions";
import { House } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import destination1 from './assets/imgs/destination-img-1.jpg'
import destination2 from './assets/imgs/destination-img-2.jpg'
import destination3 from './assets/imgs/destination-img-3.jpg'
import destination4 from './assets/imgs/destination-img-4.jpg'
import { Heart } from "lucide-react";
import Link from "next/link";
import { streamConversation, Message, submitFormResponse } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from 'next/router';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useFormState, useFormStatus } from "react-dom";


export default function Hero() {
    const { isStarted, setIsStarted } = useCitySwipe();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>([]);
    const questionKeys = Object.keys(quizQuestions);
    const [updateHeart, setUpdateHeart] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            setCurrentQuestionIndex((prevIndex) => 
                Math.min(prevIndex + 1, questionKeys.length - 1)
        );
    } else if (event.key === 'ArrowUp') {
        setCurrentQuestionIndex((prevIndex) => 
            Math.max(prevIndex - 1, 0)
    );
}
};

    const handleHomeFunction = () => {
        setCurrentQuestionIndex(0);
        setIsStarted(false);
        setResponses([]);
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => 
            Math.min(prevIndex + 1, questionKeys.length - 1)
        );
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => 
            Math.max(prevIndex - 1, 0)
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newResponses = [...responses];
        newResponses[currentQuestionIndex] = event.target.value;
        setResponses(newResponses);
        console.log(responses);
    };




    // animations    


    const hoverAnimationEnter = (imgid : string) => {
        let id = '#' + imgid + '-img'

        if (imgid != '') {
            gsap.to(id, {
                opacity: 1,
                duration: 0.5,
            });
        } 

        setUpdateHeart(true)

    }

    const hoverAnimationLeave = (imgid : string) => {
        let id = '#' + imgid + '-img'
        if (imgid != '') {
            gsap.to(id, {
                opacity: 0,
                duration: 0.5,
            });
        } 

        setUpdateHeart(false)
    }
    const handleGemini = async () => {
        const prompt = 
        `Based on the following travel preferences, generate a list of exactly 50 travel destinations formatted as 'City, Country, Compatibility Percentage. Exact Example format:
        Tokyo, Japan 85%
        Paris, France 78%
        ... 48 more of the same format
        Make sure the compatibility percentage is a number between 0 and 100. Each entry should be on a new line, there should be no additional text before or after the output(including bullet points or numbering), follow exact example. Coerlate all the data when making decisions. Questions are answered by the user in order of listing as follows: home country, luxury mid range or budget places, languages spoken, comfortable in country with unkwown language or no, preffered season, preffered temperature, beach mountain or city, 5 favorite activites, dietary restrictions and preferences, local food fine dining or street, preffered activites and facilities, comfortable in country with recreational drug use or not. Responses in order:\n\n${responses.join('\n')}`;
    
        const conversationHistory: Message[] = [
            { role: "user" as const, content: prompt },
        ];
    
        const { newMessage } = await streamConversation(conversationHistory);
        let textContent = "";
    
        for await (const delta of readStreamableValue(newMessage)) {
            textContent += delta;
        }
    
        const generatedDestinations = textContent.split('\n').map(destination => {
            const cleanedDestination = destination.replace(/^.*?(?=[A-Za-z]),/, '');
            const [location, score] = cleanedDestination.split('[');
            return {
                location: location ? location.trim() : '',
                compatibilityScore: score ? parseFloat(score.replace(']', '').trim()) : null,
            };
        });
    
        setDestinations(generatedDestinations.filter(destination => destination.location));
        console.log(generatedDestinations);
    };

    const SubmitButton = () => {
        const status = useFormStatus();
        
        if (status.pending != true) {
          return (
            <button className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded" type="submit">Join The Wait list</button>
          )
        }
    
        if (status.pending === true) {
          return (
            <button className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-50 font-bold py-2 px-4 rounded text-gray-600 animate-pulse" disabled>Submitting..</button>
          )
        }
      }

      type FormState = {
        message: string;
      };
  
      const formAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
        await submitFormResponse(formData, formState);
        return { message: 'Submission successful!' };
      };
  
      const [formState, action] = useFormState(formAction, {
        message: '',
      });
  


  

    return (
        <>
        
        
        <div className="flex flex-col w-full place-items-center gap-6">
            {!isStarted ? (
                <>
  
                    <div className="z-[-1] top-0 left-0 w-screen h-screen absolute">
                    <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="match-img" className="opacity-1  w-full h-full object-cover" src={destination1.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="with-img" className="opacity-0  w-full h-full object-cover" src={destination2.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="your-img" className="opacity-0  w-full h-full object-cover" src={destination3.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-screen h-screen">
                            <img id="destination-img" className="opacity-0  w-full h-full object-cover" src={destination4.src} alt="" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white to-transparent pointer-events-none"></div>
                        </div>
                    </div>   

                    <h2>Like Tinder, but for your vacations!</h2>                 
                   
                    <h1 className="text-5xl w-full flex gap-2 place-content-center select-none relative flex-wrap">
                        <span id="match" onMouseOver={() => hoverAnimationEnter('match')} onMouseLeave={() => hoverAnimationLeave('match')} className="cursor-pointer">Match </span>
                        <span id="with" onMouseOver={() => hoverAnimationEnter('with')} onMouseLeave={() => hoverAnimationLeave('with')} className="cursor-pointer">with </span>
                        <span id="your" onMouseOver={() => hoverAnimationEnter('your')} onMouseLeave={() => hoverAnimationLeave('your')} className="cursor-pointer">your </span>
                        <span id="destination" onMouseOver={() => hoverAnimationEnter('destination')} onMouseLeave={() => hoverAnimationLeave('destination')} className="cursor-pointer">destination</span> 
                    </h1>

                    <Dialog>
                        <DialogTrigger>          
                    <span className=" text-white py-2 px-4 rounded-md select-none bg-gradient-to-t from-cyan-500 to-green-400 flex place-items-center gap-2">
                        Get Started 
                        {updateHeart == false && <span><Heart className="w-2 h-2  "/></span>}
                        {updateHeart == true && <span><Heart className="w-2 h-2 text-red-300 animate-pulse"/></span>}
                    </span>
                        </DialogTrigger>
                        <DialogContent className="scale-[80%] sm:scale-100">
                            <DialogHeader>
                            <DialogTitle>Join our wait list for early access!</DialogTitle>
                            <DialogDescription>
                                
                                <p>When we launch you will receive first access to our full beta!</p>


                                <form className="flex flex-col gap-6 my-5" action={action}>
                                
                                <p className="flex place-self-center text-green-500">{formState.message}</p>

                                <Input type="text" name="Name" placeholder="Name" className="w-full" />
                                <Input type="email" name="Email" placeholder="Email address" className="w-full" />
                                <SubmitButton />
                                </form>

                                <p>Thank you for the support!</p>
                                <h1 className="select-none font-bold absolute bottom-0 right-0 m-3">cityswipe</h1>
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
          

                    {/* this buton leads to the quiz, the diolog and button above is for getting signups! */}
                    {/* <Button className="select-none bg-gradient-to-t from-cyan-500 to-green-400 flex place-items-center gap-2" onClick={() => setIsStarted(true)}>
                        Get Started 
                        {updateHeart == false && <span><Heart className="w-2 h-2  "/></span>}
                        {updateHeart == true && <span><Heart className="w-2 h-2 text-red-300 animate-pulse"/></span>}
                    </Button> */}
                </>
            ) : (
                <>
                    <div id="question-container" className="w-full h-64 gap-6 flex flex-col place-items-center place-content-center">
                        
                        <p className="text-xl">{quizQuestions[questionKeys[currentQuestionIndex] as keyof typeof quizQuestions]}</p>
                        
                        <div className="flex w-full gap-6 place-content-center">
                        {responses[currentQuestionIndex]?.length > 2 && 
                        <Button className="p-0 m-0 select-none bg-transparent hover:bg-transparent text-primary hover:opacity-80 flex place-self-start" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Back</Button>
                        }
                        <Input 
                            id="response-input" 
                            type="text" 
                            className="w-1/4" 
                            autoComplete="off"
                            value={responses[currentQuestionIndex] || ''}
                            onChange={handleInputChange}
                        />
                        {responses[currentQuestionIndex]?.length > 2 && 
                            <Button className="bg-gradient-to-t from-cyan-500 to-green-400  select-none" onClick={handleNext}>Next</Button>
                        }
                        </div>
                    </div>


                    {isStarted && currentQuestionIndex === questionKeys.length - 1 &&
                    <>
                        <Link className="flex place-self-center" href="/explore">
                            <Button onClick={() => handleGemini()} className="bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">Find Your Match!</Button>
                        </Link>


                    </>
                    }

                    {/* debugging stuff */}
                    {/* <div className="w-full mt-4">
                        <h2 className="text-xl">Saved Responses:</h2>
                        <ul>
                        {responses.map((response, index) => (
                            <li key={index}>{`Question ${index + 1}: ${response}`}</li>
                            ))}
                            </ul>
                            </div> */}
                    {/* debugging stuff end */}
        <button className=" w-5 h-5 absolute bottom-10 right-10 bg-transparent hover:bg-transparent text-primary hover:opacity-80 z-10" onClick={() => handleHomeFunction()}>
            <House className="absolute bottom-10 right-10 w-5 h-5" />
        </button>
                </>
            )}
        </div> 
 

        </>
    );
}
