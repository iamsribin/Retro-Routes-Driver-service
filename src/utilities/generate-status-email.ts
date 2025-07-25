  export const generateStatusEmail =(
    status: string,
    name: string,
    reason?: string
  ): { subject: string; text: string } =>{
    switch (status) {
      case "Good":
        return {
          subject: "Account Verified Successfully",
          text: `Hello ${name}, 
Thank you for registering with Retro Routes! We're excited to have you on board. Your account has been successfully verified.

Thank you for choosing RetroRoutes. We look forward to serving you and making your journeys safe and convenient.

Best regards,
Retro Routes India`,
        };
      case "Rejected":
        return {
          subject: "Account Registration Rejected",
          text: `Hello ${name}, 
We regret to inform you that your registration with Retro Routes has been rejected.

Reason: ${reason}

You may resubmit your application by updating the missing information.

Sincerely,
Retro Routes India`,
        };
      default:
        return {
          subject: "Account Status Updated",
          text: `Hello ${name}, 
Your account status has been updated to: ${status}
Reason: ${reason}

Sincerely,
Retro Routes India`,
        };
    }
  }