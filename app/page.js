'use client'

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, query, getDoc, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";

export default function Home() {
    const [Pantry, setPantry] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredPantry, set_Filtered_Pantry] = useState([]);
    const [searchTerm, set_Search_Term] = useState("");
    const [itemName, setItemName] = useState('');

    const updatePantry = async () => {
        const snapshot = query(collection(firestore, 'Pantry'));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        docs.forEach((doc) => {
            // Skip NaN items
            if (doc.id !== "NaN") {
                pantryList.push({
                    name: doc.id,
                    ...doc.data(),
                });
            }
        });
      
        setPantry(pantryList);
        set_Filtered_Pantry(pantryList);
    };

    const addItem = async (item) => {
        // skip empty or NaN items
        if (!item || item === "NaN") {
            return;
        }
        
        // convert to lowercase for storage (case-insensitive matching)
        const normalizedItem = item.toLowerCase();
        
        const docRef = doc(collection(firestore, 'Pantry'), normalizedItem);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            // Handle NaN quantity
            const currentQuantity = isNaN(quantity) ? 0 : quantity;
            await setDoc(docRef, { quantity: currentQuantity + 1 });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }

        await updatePantry();
    };

    useEffect(() => {
        set_Filtered_Pantry(
            Pantry.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, Pantry]);

    const removeItem = async (item) => {
        // skips NaN items (avoids error)
        if (!item || item === "NaN") {
            return;
        }
        
        const docRef = doc(collection(firestore, 'Pantry'), item);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            // Handle NaN quantity
            const currentQuantity = isNaN(quantity) ? 1 : quantity;
            
            if (currentQuantity <= 1) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, { quantity: currentQuantity - 1 });
            }
        }

        await updatePantry();
    };

    useEffect(() => {
        updatePantry();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Function to capitalize first letter
    const formatItemName = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <Box
            width="1000w"
            height="100vh"
            display="flex"
            bgcolor="white"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
                backgroundImage: "url('/pantry.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >   
            {/* Pop out when adding an item */}
            <Modal open={open} onClose={handleClose}> 
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width={400}
                    bgcolor="white"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Typography variant="h6"> Add Item </Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <TextField
                            label="Item Name"
                            variant="outlined"
                            fullWidth
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (itemName.trim()) {
                                    addItem(itemName);
                                    setItemName('');
                                    handleClose();
                                } else {
                                    alert("Please enter a valid item name");
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* UI for search field */}
            <TextField
                label="Search item"
                variant="outlined"
                width="800px"
                value={searchTerm}
                onChange={(e) => set_Search_Term(e.target.value)}
                sx={{ marginBottom: 2, backgroundColor: 'white'}}
            />
            <Button 
                variant="contained"
                onClick={() => set_Filtered_Pantry(
                    Pantry.filter((item) =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )}
            >
                Search
            </Button>
            <Button 
                variant="contained"
                onClick={handleOpen}
            >
                Add New Item
            </Button>
            <Box border="1px solid #333">
                <Box
                    width="800px"
                    height="100px"
                    bgcolor="#ADD8E6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="h2" color="#333">
                        Pantry Inventory
                    </Typography>
                </Box>

                <Stack width="800px" height="300px" spacing={2} overflow="auto" sx={{ bgcolor: "#ffffff" }}>
                    {filteredPantry.map(({ name, quantity }) => (
                        <Box
                            key={name}
                            width="100%"
                            minHeight="150px"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            bgcolor="#f0f0f0"
                            padding={5}
                        >
                            <Typography variant="h3" color="#333" textAlign="center">
                                {formatItemName(name)}
                            </Typography>

                            <Typography variant="h3" color="#333" textAlign="center">
                                {isNaN(quantity) ? 0 : quantity}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        removeItem(name);
                                    }}
                                >
                                    Remove
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}







// 'use client'

// import { useState, useEffect } from 'react';
// import { firestore } from '@/firebase';
// import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
// import { collection, query, getDoc, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";

// export default function Home() {
//     const [Pantry, setPantry] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [filteredPantry, set_Filtered_Pantry] = useState([]);
//     const [searchTerm, set_Search_Term] = useState("");
//     const [itemName, setItemName] = useState('');

//     const updatePantry = async () => {
//         const snapshot = query(collection(firestore, 'Pantry'));
//         const docs = await getDocs(snapshot);
//         const pantryList = [];
//         docs.forEach((doc) => {
//             pantryList.push({
//                 name: doc.id,
//                 ...doc.data(),
//             });
//         });
      
//         setPantry(pantryList);
//         set_Filtered_Pantry(pantryList);
//     };

//     const addItem = async (item) => {
//         const docRef = doc(collection(firestore, 'Pantry'), item);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             const { quantity } = docSnap.data();
//             await setDoc(docRef, { quantity: quantity + 1 });
//         } else {
//             await setDoc(docRef, { quantity: 1 });
//         }

//         await updatePantry();
//     };

//     useEffect(() => {
//         set_Filtered_Pantry(
//             Pantry.filter((item) =>
//                 item.name.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//         );
//     }, [searchTerm, Pantry]);

//     const removeItem = async (item) => {
//         const docRef = doc(collection(firestore, 'Pantry'), item);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             const { quantity } = docSnap.data();
//             if (quantity === 1) {
//                 await deleteDoc(docRef);
//             } else {
//                 await setDoc(docRef, { quantity: quantity - 1 });
//             }
//         }

//         await updatePantry();
//     };

//     useEffect(() => {
//         updatePantry();
//     }, []);

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);

//     return (
//         <Box
//             width="1000w"
//             height="100vh"
//             display="flex"
//             bgcolor="white"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             gap={2}
//             sx={{
//                 backgroundImage: "url('/pantry.jpg')",
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat'
//             }}
//         >
//             <Modal open={open} onClose={handleClose}>
//                 <Box
//                     position="absolute"
//                     top="50%"
//                     left="50%"
//                     width={400}
//                     bgcolor="white"
//                     border="2px solid #000"
//                     boxShadow={24}
//                     p={4}
//                     display="flex"
//                     flexDirection="column"
//                     gap={3}
//                     sx={{
//                         transform: 'translate(-50%, -50%)',
//                     }}
//                 >
//                     <Typography variant="h6"> Add Item </Typography>
//                     <Stack width="100%" direction="row" spacing={2}>
//                         <TextField
//                             label="Item Name"
//                             variant="outlined"
//                             fullWidth
//                             value={itemName}
//                             onChange={(e) => setItemName(e.target.value)}
//                         />
//                         <Button
//                             variant="outlined"
//                             onClick={() => {
//                                 addItem(itemName);
//                                 setItemName('');
//                                 handleClose();
//                             }}
//                         >
//                             Add
//                         </Button>
//                     </Stack>
//                 </Box>
//             </Modal>

//             {/* UI for search field */}
//             <TextField
//                 label="Search item"
//                 variant="outlined"
//                 width="800px"
//                 value={searchTerm}
//                 onChange={(e) => set_Search_Term(e.target.value)}
//                 sx={{ marginBottom: 2, backgroundColor: 'white'}}
//             />
//             <Button 
//                 variant="contained"
//                 onClick={() => set_Filtered_Pantry(
//                     Pantry.filter((item) =>
//                         item.name.toLowerCase().includes(searchTerm.toLowerCase())
//                     )
//                 )}
//             >
//                 Search
//             </Button>
//             <Button 
//                 variant="contained"
//                 onClick={handleOpen}
//             >
//                 Add New Item
//             </Button>
//             <Box border="1px solid #333">
//                 <Box
//                     width="800px"
//                     height="100px"
//                     bgcolor="#ADD8E6"
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                 >
//                     <Typography variant="h2" color="#333">
//                         Pantry Inventory
//                     </Typography>
//                 </Box>

//                 <Stack width="800px" height="300px" spacing={2} overflow="auto" sx={{ bgcolor: "#ffffff" }}>
//                     {filteredPantry.map(({ name, quantity }) => (
//                         <Box
//                             key={name}
//                             width="100%"
//                             minHeight="150px"
//                             display="flex"
//                             alignItems="center"
//                             justifyContent="space-between"
//                             bgcolor="#f0f0f0"
//                             padding={5}
//                         >
//                             <Typography variant="h3" color="#333" textAlign="center">
//                                 {name.charAt(0).toUpperCase() + name.slice(1)}
//                             </Typography>

//                             <Typography variant="h3" color="#333" textAlign="center">
//                                 {quantity}
//                             </Typography>
//                             <Stack direction="row" spacing={2}>
//                                 <Button
//                                     variant="contained"
//                                     onClick={() => {
//                                         removeItem(name);
//                                     }}
//                                 >
//                                     Remove
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     ))}
//                 </Stack>
//             </Box>
//         </Box>
//     );
// }
