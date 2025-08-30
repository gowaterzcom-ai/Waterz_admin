import styles from "../../styles/Loaders/Loader1.module.css";
import loader from "../../assets/loader/loader.gif";

const Loader1 = () => {
  return (
    <div className={styles.body}>
        <div className={styles.container}>
            <img 
              src={loader} 
              alt="Loading..."
              className={styles.loadergif}
            />
        </div>
    </div>
  );
};

export default Loader1;

// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import styles from "../../styles/Loaders/Loader1.module.css";
// import loader from "../../assets/loader/loader.gif";


// const Loader1 = () => {
//   return (
//     <div className={styles.body} >
//         <div className={styles.container}>
//             <DotLottieReact
//               src={loader}
//               loop
//               autoplay
//             />
//         </div>
//     </div>
//   );
// };


// export default Loader1;