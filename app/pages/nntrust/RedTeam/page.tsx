import React, { useState, useEffect } from 'react';
import { AttackProps } from '@/interfaces/NNInterfaces';
import AttackCard from '@/components/client/redtool/AttackCard';
import './Benchmark.css';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import Status from '@/components/client/redtool/Status';
import { listAttacks } from './prova';

const Benchmark: React.FC = () => {
  const [attacks, setAttacks] = useState<AttackProps[]>([]);
  const [open, setOpen] = useState<boolean>(false)
  const [selectedAttacks, setSelectedAttacks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // this function has to be updated to make a backend call
    // to get the list of all the available attacks

    const loadAttacks = async () => {
      try {
        setAttacks(listAttacks);
        if (listAttacks.length > 0) {
          const allIds = listAttacks.map(attack => attack.id);
          setSelectedAttacks(new Set(allIds));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadAttacks();
  }, []);

  const handleAttackSelect = (attackId: string) => {
    setSelectedAttacks(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(attackId)) {
        newSelected.delete(attackId);
      } else {
        newSelected.add(attackId);
      }
      return newSelected;
    });
  };

  function loadingPage() {
    // handle the page while the attacks are being loaded.
    return (
      <div className="attack-list">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading adversarial attacks...</div>
        </div>
      </div>
    );
  }

  function errorPage() {
    // handle the page if there are some problems during the loading of the attacks.
    return (
      <div className="attack-list">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-200 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  function attackPage() {
    // True display of the page when everything goes as planned.
    return (
      < div className="attack-list" >
        <div className='attack-title'>
          <div className='attack-header'>
            <h1>Red Teaming</h1>
            <p>In this section it will be possible to test the model robustness under multiple vulnerabilities.</p>
          </div>
          <button className='attack-button'>
            <Play className='icon' />
            <div className='btn-desc'> Execute benchmark</div>
          </button>
        </div>

        <Status attackList={Array.from(selectedAttacks)} />

        <div className='attack-title'>
          <div className='attack-header'>Vulnearbility selection</div>
          <button className='btn-open'
            onClick={() => setOpen((prev) => !prev)}>
            {open ?
              <ChevronUp className='icon' /> :
              <ChevronDown className='icon' />
            }
          </button>

        </div>

        {
          open ?

            <div className="attacks-grid">
              {attacks.map((attack) => (
                <AttackCard
                  key={attack.id}
                  attack={attack}
                  isSelected={selectedAttacks.has(attack.id)}
                  onSelect={handleAttackSelect}
                />
              ))}
            </div>
            : null
        }
      </div >);
  }

  if (error) {
    return errorPage();
  }
  else {
    if (loading) {
      return loadingPage()
    }
    else {
      return attackPage();
    }
  }
};

export default Benchmark;