"use client"

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";


const SignIn = () => {
    const {register, handleSubmit, control, formState:{errors, isSubmitting}} = useForm<SignUpFormData>({
        defaultValues:{
            fullName:"",
            email:"",
            password:"",
            country:"India",
            investmentGoals:"Growth",
            riskTolerance:"medium",
            preferredIndustry:"Technology"
        },
        mode:"onBlur"
    })
    const onSubmit = (data:SignUpFormData)=> {
        try{
            console.log(data)
        }catch(e){
            console.error(e)
        }
    }
    return (
        <>
            <h1 className="form-title">Log In Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit) } className="space-y-5">


                <InputField
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    register={register}
                    error={errors.email}
                    validation={{required:"Email is required", pattern:"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"  }}/>

                <InputField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register}
                    error={errors.password}
                    validation={{required:"Passsword is required", minLength:8}}/>


                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Logging in" :"Log In"}
                </Button>
                <FooterLink text="Don't have an account? " linkText="Sign up" href="/sign-up"/>
            </form>
        </>
    )
}
export default SignIn
