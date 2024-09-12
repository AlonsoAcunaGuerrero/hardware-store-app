import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { fetchAllProductTypes } from "../services/ProductTypeService";

export default function ProductTypesBar(){
    const [list, setList] = useState(null);

    const fetchProductTypes = async () => {
        await fetchAllProductTypes()
        .then((res) => {
            setList(buildTree(res))
        })
        .catch((err) => {
            console.log(err)
        });
    }

    function buildTree(data) {
        // Crear un diccionario para almacenar los nodos por id para un acceso rápido
        const nodeMap = {};
        data.forEach(node => {
            node.children = []; // Inicializar la lista de hijos
            nodeMap[node.id] = node;
        });
    
        // Iterar sobre los nodos y construir la estructura del árbol
        const rootNodes = [];
        data.forEach(node => {
            if (node.parent) {
                // Si tiene un padre, agregamos este nodo como hijo del padre
                const parentNode = nodeMap[node.parent.id];
                if (parentNode) {
                    parentNode.children.push(node);
                } else {
                    // Si el padre no está en el mapa, este nodo es una raíz
                    rootNodes.push(node);
                }
            } else {
                // Si no tiene padre, es una raíz
                rootNodes.push(node);
            }
        });
    
        return rootNodes;
    }

    useEffect(() => {
        fetchProductTypes();
    }, [])

    return(
        <div className="fixed hidden xl:flex bg-white border shadow p-2 min-w-[250px]">
            <ul className="flex flex-col gap-2 w-full">
                {
                    list?.map((productType, index) =>(
                        <li key={productType?.id}>
                            <ProductTypeButton id={productType?.id} name={productType?.name} 
                                others={productType?.children} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

function ProductTypeButton({id, name, others}){

    const [expanded, setExpanded] = useState(false);

    if(others?.length > 0){
        console.log(others);
    }

    return(
        <div className="flex flex-col">
            <div className="flex flex-row gap-0">
                {
                    others?.length > 0 ? (
                        <button className="rounded-l border-2 border-r-0 border-black p-1
                            hover:bg-black hover:text-white"
                            onClick={() => setExpanded(!expanded)}
                        >
                            <IoMdArrowDropdown className={`text-[1.25em] ${expanded ? "rotate-180" : "rotate-0"} 
                            transition delay-75 duration-75`} />
                        </button>
                    ) : null
                }
                <NavLink to={`/products/type/${name}?page=1&limit=12&display=G`} 
                    className={`flex justify-center items-center text-center p-1 w-full
                    ${others?.length == 0 ? "rounded border-2" : "rounded-r border-2"} border-black 
                    hover:bg-black hover:text-white`}>
                    {name}
                </NavLink>
            </div>

            {
                expanded ? 
                <ul className="flex flex-col gap-1 mt-2">
                    {
                        others?.map((type) =>
                            <li>
                                <ProductTypeButton id={type?.id} name={type?.name} others={type?.children} />
                            </li>
                        )
                    }
                </ul>
                : null
            }
        </div>
    )
}