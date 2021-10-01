import { useSession, signIn, options } from "next-auth/client";
import cogoToast from 'cogo-toast';
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
import { useRouter } from "next/dist/client/router";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if(!session) {
      signIn('github');
      return;
    }

    if(session.activeSubscription) {
      router.push('/posts');
      return;
    }
    

    //Criação da checkout session
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})
    } catch (error) {
      cogoToast.error(error.message);
    }
  }

  return (
    <button 
      type="button" 
      className={styles.SubscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
